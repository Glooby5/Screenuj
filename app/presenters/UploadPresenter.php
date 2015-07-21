<?php
namespace App\Presenters;

use Screenuj\Model\ImageStorage;

class UploadPresenter extends BasePresenter
{    
    /** @var type ImageStorage */
    public $storage;
    
    public function __construct(ImageStorage $storage)
    {
        parent::__construct();
        $this->storage = $storage;
    }
    
    public function actionSave()
    {        
        $filename = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);

        if ($filename) {
            $data = file_get_contents('php://input');

            $user = $this->user->isLoggedIn() ? $this->user->id : "public";
            
            $this->storage->save($filename, $data, $user);
                echo "$filename uploaded";
                exit();

        }
        
        $this->sendPayload(); 
    }    
}
