<?php
namespace APP\plugins\generic\publicPublications;

use APP\core\Application;
use APP\facades\Repo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use PKP\core\PKPBaseController;
use PKP\core\PKPRequest;
use PKP\security\authorization\ContextRequiredPolicy;

class PublicPublicationsController extends PKPBaseController
{
    public function __construct(private PublicPublicationsPlugin $plugin) {}
    public function getHandlerPath(): string { return 'publicPublications'; }
    public function getRouteGroupMiddleware(): array { return ['has.context']; }
    public function getGroupRoutes(): void
    {
        Route::get('issues', $this->listing(...));
        // Validate inside the handler: unmatched constrained routes raise upstream 500s.
        Route::get('issues/{issueId}', $this->detail(...));
    }
    public function authorize(PKPRequest $request, array &$args, array $roleAssignments): bool
    {
        if (!$this->publicContext()) return false;
        $this->addPolicy(new ContextRequiredPolicy($request));
        return parent::authorize($request, $args, $roleAssignments);
    }
    private function publicContext(): bool
    {
        $c = $this->getRequest()->getContext();
        return $c && Visibility::context([
            'path' => $c->getPath(), 'enabled' => (bool) $c->getData('enabled'),
            'pluginEnabled' => (bool) $this->plugin->getEnabled($c->getId()),
            'restricted' => (bool) $c->getData('restrictSiteAccess'),
            'mode' => $c->getData('publishingMode'),
        ]);
    }
    private function output(array $data, int $status = 200)
    {
        if (!$this->publicContext()) { $data = ['error' => 'Not available']; $status = 404; }
        if (strlen(json_encode($data, JSON_THROW_ON_ERROR)) > 1048576) {
            $data = ['error' => 'Projection size limit']; $status = 413;
        }
        return response()->json($data, $status)->header('Cache-Control', 'no-store')->header('X-Content-Type-Options', 'nosniff');
    }
    private function integer($value, int $min, int $max): ?int
    {
        if (!is_scalar($value) || !preg_match('/^(0|[1-9][0-9]{0,8})$/D', (string) $value)) return null;
        $n = (int) $value;
        return $n >= $min && $n <= $max ? $n : null;
    }
    private function issueDto($i): ?array
    {
        $c = $this->getRequest()->getContext();
        $dto = ['id' => (int) $i->getId(), 'journalId' => (int) $i->getData('journalId'), 'published' => (bool) $i->getData('published')];
        if (!Visibility::issue($dto, (int) $c->getId())) return null;
        foreach (['title', 'description', 'volume', 'number', 'year', 'datePublished'] as $key) $dto[$key] = $i->getData($key);
        $dto['year'] = (int) $dto['year'];
        $dto['current'] = (int) $c->getData('currentIssueId') === $dto['id'];
        $dto['publishedUrl'] = $this->readerUrl('issue', $i->getBestIssueId());
        $cover = $i->getData('coverImage');
        if (is_array($cover)) {
            $coverUrl = [];
            foreach ($cover as $loc => $file) {
                if (is_string($file) && preg_match('/^[a-zA-Z0-9._-]+\.(jpe?g|png|webp)$/i', $file)) {
                    $coverUrl[$loc] = $this->getRequest()->getBaseUrl() . '/public/journals/' . (int) $c->getId() . '/' . $file;
                }
            }
            if (!empty($coverUrl)) $dto['coverUrl'] = $coverUrl;
        }
        return $dto;
    }
    private function readerUrl(string $page, $id): string
    {
        $r = $this->getRequest();
        return $r->getDispatcher()->url($r, Application::ROUTE_PAGE, $r->getContext()->getPath(), $page, 'view', [$id], urlLocaleForPage: '');
    }
    public function listing(Request $request)
    {
        $count = $this->integer($request->query('count', '100'), 1, 100);
        $offset = $this->integer($request->query('offset', '0'), 0, 9900);
        if ($count === null || $offset === null) return $this->output(['error' => 'Invalid pagination'], 400);
        $collector = Repo::issue()->getCollector()->filterByContextIds([$this->getRequest()->getContext()->getId()])->filterByPublished(true);
        $total = $collector->getCount();
        $items = [];
        foreach ($collector->limit($count)->offset($offset)->getMany() as $issue) {
            if ($dto = $this->issueDto($issue)) $items[] = $dto;
        }
        return $this->output(['contract' => 'public-publications-v1', 'itemsMax' => $total, 'items' => $items]);
    }
    public function detail(Request $request)
    {
        $id = $this->integer($this->getParameter('issueId'), 1, 999999999);
        $issue = $id ? Repo::issue()->get($id) : null;
        $dto = $issue ? $this->issueDto($issue) : null;
        if (!$dto) return $this->output(['error' => 'Not available'], 404);
        $contextId = (int) $this->getRequest()->getContext()->getId();
        $collector = Repo::submission()->getCollector()->filterByContextIds([$contextId])->filterByIssueIds([$id])->filterByStatus([3]);
        // Never silently truncate a TOC: an oversized issue requires a future paged contract.
        if ($collector->getCount() > 200) return $this->output(['error' => 'Projection article limit'], 413);
        $dto['articles'] = []; $sections = [];
        foreach ($collector->limit(200)->getMany() as $s) {
            $p = $s->getCurrentPublication();
            if (!$p) continue;
            $section = Repo::section()->get((int) $p->getData('sectionId'));
            if (!$section) continue;
            $a = ['id' => (int) $s->getId(), 'contextId' => (int) $s->getData('contextId'), 'status' => (int) $s->getData('status'), 'currentPublicationId' => (int) $s->getData('currentPublicationId')];
            $pub = ['id' => (int) $p->getId()];
            foreach (['submissionId', 'status', 'issueId', 'sectionId'] as $key) $pub[$key] = (int) $p->getData($key);
            $sec = ['id' => (int) $section->getId(), 'contextId' => (int) $section->getData('contextId')];
            if (!Visibility::article($a, $pub, $sec, $contextId, $id)) continue;
            $sec['title'] = $section->getData('hideTitle') ? [] : $section->getData('title');
            $sec['abbrev'] = $section->getData('hideTitle') ? [] : $section->getData('abbrev');
            $sections[$sec['id']] = $sec;
            $pub['title'] = $p->getFullTitles();
            foreach (['datePublished', 'pages', 'locale'] as $key) $pub[$key] = $p->getData($key);
            // Short public display only, never author objects/emails/affiliations.
            $pub['authorsStringIncludeInBrowse'] = $section->getData('hideAuthor') ? '' : $p->getAuthorString(new \ArrayIterator([]), true);
            $pub['urlPublished'] = $this->readerUrl('article', $s->getBestId());
            $cover = $p->getData('coverImage');
            if (is_array($cover)) {
                $coverUrl = [];
                foreach ($cover as $loc => $data) {
                    $file = is_array($data) ? ($data['uploadName'] ?? null) : (is_string($data) ? $data : null);
                    if (is_string($file) && preg_match('/^[a-zA-Z0-9._-]+\.(jpe?g|png|webp)$/i', $file)) {
                        $coverUrl[$loc] = $this->getRequest()->getBaseUrl() . '/public/journals/' . $contextId . '/' . $file;
                    }
                }
                if (!empty($coverUrl)) $pub['coverUrl'] = $coverUrl;
            }
            $a['publications'] = [$pub];
            $dto['articles'][] = $a;
        }
        // Re-read visibility at response time; no cross-request cache.
        $fresh = Repo::issue()->get($id);
        if (!$fresh || !$this->issueDto($fresh)) return $this->output(['error' => 'Not available'], 404);
        $dto['sections'] = array_values($sections);
        $dto['contract'] = 'public-publications-v1';
        return $this->output($dto);
    }
}
