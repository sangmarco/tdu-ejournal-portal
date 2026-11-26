<?php
namespace APP\plugins\generic\publicPublications;

use PKP\plugins\GenericPlugin;
use PKP\plugins\Hook;

class PublicPublicationsPlugin extends GenericPlugin
{
    public function register($category, $path, $mainContextId = null)
    {
        if (!parent::register($category, $path, $mainContextId)) return false;
        if ($this->getEnabled($mainContextId)) {
            Hook::add('APIHandler::endpoints::plugin', function ($hook, $router) {
                $router->registerPluginApiControllers([new PublicPublicationsController($this)]);
                return false;
            });
        }
        return true;
    }
    public function getDisplayName() { return 'Public publications pilot'; }
    public function getDescription() { return 'Read-only, bounded public metadata projection for the explicitly approved pilot journal.'; }
}
