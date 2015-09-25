<?php
namespace App\Presenters;

use Nette\Application\Responses\JsonResponse;
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
        $filename = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);

        if (!$filename)
            $this->sendResponse(new JsonResponse(['state' => 'error', 'type' => 'nofile']));
        
        $data = file_get_contents('php://input');
        
        $type = $this->user->isLoggedIn() ? ImageStorage::PRIVATE_IMG : ImageStorage::PUBLIC_IMG;
        $user = $this->user->isLoggedIn() ? $this->userService->get($this->user->id) : NULL;
        //dump($this->userService->get($this->user->id));
        $result = $this->storage->save($filename, $data, $type, $user);
        
        $this->sendResponse(new JsonResponse(['state' => 'success', 'code' => $result['code'], 'token' => $result['image']->token]));
        
        die();         
    }
    
    public function actionUpdate($token, $image)
    {
        
        try
        {
            $this->storage->Update($token, $image);
        }
        catch (\Exception $ex)
        {
            $this->sendResponse(new JsonResponse(['status' => 'error', 'message' => $ex->getMessage()]));
        }
        
        $this->sendResponse(new JsonResponse(['status' => 'success']));
        
        die();
    }
}
