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
        $filename = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);

        if ($filename) {
            $data = file_get_contents('php://input');

            $type = $this->user->isLoggedIn() ? ImageStorage::PRIVATE_IMG : ImageStorage::PUBLIC_IMG;
            $user = $this->user->isLoggedIn() ? $this->userService->get($this->user->id) : NULL;
            
            $this->storage->save($filename, $data, $type, $user);
                echo "$filename uploaded";
                exit();

        }
        
        $this->sendPayload(); 
    }    
}
