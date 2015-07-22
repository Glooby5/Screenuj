<?php
namespace Screenuj\Model;

use Nette\Object;
use Nette\Utils\Image;
use Screenuj\Entities\Image as Image2;
use Screenuj\Entities\User;
use Screenuj\Services\ImageService;

class ImageStorage extends Object
{
    const PUBLIC_IMG = 0;
    const PRIVATE_IMG = 1;
    
    private $dir;
    
    /** @var ImageService */
    private $imageService;

    public function __construct($dir, ImageService $imageService)
    {
        $this->dir = $dir;
        
        if (!is_dir($dir)) {
            umask(0);
            mkdir($dir, 0777);
        }
        
        $this->imageService = $imageService;
    }
    
    private function testFolder($type, $user)
    {
        umask(0);
        
        if ($type == ImageStorage::PUBLIC_IMG) {
            $dir = '/public';
            if (!is_dir($this->dir . $dir)) mkdir($dir, 0777);            
            
            $dir .= '/'. date('Y');
            if (!is_dir($this->dir . $dir)) mkdir($dir, 0777);
            
            $dir .= '/'. date("m");
            if (!is_dir($this->dir . $dir)) mkdir($dir, 0777);
            
            $dir .= '/'. date("d"); 
            if (!is_dir($this->dir . $dir)) mkdir($dir, 0777);
        } else if ($user) {
            $dir = '/private';
            if (!is_dir($this->dir . $dir)) mkdir($dir, 0777);
            
            $dir .= '/'. $user;
            if (!is_dir($this->dir . $dir)) mkdir($dir, 0777);
            
            $dir .= '/'. date('Y');
            if (!is_dir($this->dir . $dir)) mkdir($dir, 0777);
            
            $dir .= '/'. date("m");
            if (!is_dir($this->dir . $dir)) mkdir($dir, 0777);
        }
        
        if (!is_dir($this->dir . $dir .'/thumbs'))
            mkdir ($this->dir . $dir .'/thumbs', 0777);
        
        return $dir;
    }

    public function save($filename, $data, $type, User $user)
    {
        $image = Image::fromString($data);
        
        $dir = $this->testFolder($type, $user->id);
        $name = md5($filename . $user->email . time()) .'.jpg';;
        $newFileName = $this->dir . $dir .'/'. $name;
        
        $image->save($newFileName, 80, Image::JPEG);
        
        $image->resize(300, NULL);
        $thumbFileName = $this->dir . $dir . '/thumbs/'. $name;
        
        $image->save($thumbFileName, 50, Image::JPEG);
        
        $imageRecord = new Image2($name, $dir, $user);
        $this->imageService->save($imageRecord);
        
        /** @todo Vytvořit link */
    }
}
