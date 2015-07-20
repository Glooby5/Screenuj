<?php

namespace App\Presenters;

use Screenuj\Services\UserService;
use Screenuj\Entities;


class UploadPresenter extends BasePresenter
{    
    
    public function actionSave()
    {
        $dir = $this->context->parameters['wwwDir'] . '/uploads/';
        
        $fn = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);

        if ($fn) {

                // AJAX call
                file_put_contents(
                        $dir . $fn,
                        file_get_contents('php://input')
                );
                echo "$fn uploaded";
                exit();

        }
        else {

                // form submit
                $files = $_FILES['fileselect'];

                foreach ($files['error'] as $id => $err) {
                        if ($err == UPLOAD_ERR_OK) {
                                $fn = $files['name'][$id];
                                move_uploaded_file(
                                        $files['tmp_name'][$id],
                                        'uploads/' . $fn
                                );
                                echo "<p>File $fn uploaded.</p>";
                        }
                }

        }
        $this->sendPayload();
    }    
}
