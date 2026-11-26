<?php
namespace APP\plugins\generic\publicPublications;

/** Pure fail-closed predicates; no user role can widen public visibility. */
final class Visibility
{
    public static function context(array $c): bool
    {
        // Installed context schema permits null; anonymous OJS policy denies NONE (2).
        // Accept explicit null without treating malformed or missing values as OPEN.
        return in_array($c['path'] ?? null, ['tapchi1', 'tapchi2'], true) && ($c['enabled'] ?? false)
            && ($c['pluginEnabled'] ?? false) && !($c['restricted'] ?? true)
            && array_key_exists('mode', $c) && in_array($c['mode'], [null, 0, 1], true);
    }

    public static function issue(array $i, int $context): bool
    {
        return ($i['id'] ?? 0) > 0 && ($i['journalId'] ?? null) === $context
            && ($i['published'] ?? false) === true;
    }

    public static function article(array $s, array $p, array $section, int $context, int $issue): bool
    {
        return ($s['id'] ?? 0) > 0 && ($s['contextId'] ?? null) === $context
            && ($s['status'] ?? null) === 3 && ($p['status'] ?? null) === 3
            && ($s['currentPublicationId'] ?? 0) > 0
            && ($s['currentPublicationId'] ?? null) === ($p['id'] ?? null)
            && ($p['submissionId'] ?? null) === $s['id']
            && ($p['issueId'] ?? null) === $issue
            && ($p['sectionId'] ?? 0) > 0
            && ($p['sectionId'] ?? null) === ($section['id'] ?? null)
            && ($section['contextId'] ?? null) === $context;
    }
}
