<?php
namespace App\Presenters;

use Screenuj\Model\ImageStorage;
use Screenuj\Services\UserService;

class UploadPresenter extends BasePresenter
{    
    /** @var ImageStorage */
    public $storage;
    
    /** @var UserService */
    public $userService;
    
    public function __construct(ImageStorage $storage, UserService $userService)
    {
        parent::__construct();
        $this->storage = $storage;
        $this->userService = $userService;
    }
    
    public function actionSave()
    {                
        if (isset($_FILES["image"])) 
        {
            $image = $_FILES["image"];
            if ($image["error"] > 0) 
            {
                $this->sendResponse(new \Nette\Application\Responses\JsonResponse(['type' => 'error', 'message' => $image["error"]]));
            }            
            
            $type = $this->user->isLoggedIn() ? ImageStorage::PRIVATE_IMG : ImageStorage::PUBLIC_IMG;
            $user = $this->user->isLoggedIn() ? $this->userService->get($this->user->id) : NULL;
            
            $this->storage->save($image, $type, $user);
        }
        
        $this->sendPayload(); 
    }
}
