<?php
namespace Screenuj\Model;

use Nette\Object;
use Nette\Utils\Image;

class ImageStorage extends Object
{
    private $dir;

    public function __construct($dir)
    {
        $this->dir = $dir;
        
        if (!is_dir($dir)) {
            umask(0);
            mkdir($dir, 0777);
        }
    }
    
    private function testFolder($user)
    {
        umask(0);
        
        if ($user == "public") {
            $dir = $this->dir .'/public';
            if (!is_dir($dir)) mkdir($dir, 0777);            
            
            $dir .= '/'. date('Y');
            if (!is_dir($dir)) mkdir($dir, 0777);
            
            $dir .= '/'. date("m");
            if (!is_dir($dir)) mkdir($dir, 0777);
            
            $dir .= '/'. date("d"); 
            if (!is_dir($dir)) mkdir($dir, 0777);
        } else {
            $dir = $this->dir .'/private';
            if (!is_dir($dir)) mkdir($dir, 0777);
            
            $dir .= '/'. $user;
            if (!is_dir($dir)) mkdir($dir, 0777);
        }
        
        if (!is_dir($dir .'/thumbs'))
            mkdir ($dir .'/thumbs', 0777);
        
        return $dir;
    }

    public function save($filename, $data, $user)
    {
        $image = Image::fromString($data);
        
        $dir = $this->testFolder($user);
        $name = md5($filename . $user . time()) .'.jpg';;
        $newFileName = $dir .'/'. $name;
        
        $image->save($newFileName, 80, Image::JPEG);
        
        $image->resize(300, NULL);
        $thumbFileName = $dir . '/thumbs/'. $name;
        
        $image->save($thumbFileName, 50, Image::JPEG);
    }
}
