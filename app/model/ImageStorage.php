<?php
namespace Screenuj\Model;

use Nette\Object;
use Nette\Utils\Image;
use Screenuj\Entities\Image as Image2;
use Screenuj\Entities\User;
use Screenuj\Model\HashManager;
use Screenuj\Services\ImageService;
use Screenuj\Services\LinkService;

class ImageStorage extends Object
{
    const PUBLIC_IMG = 0;
    const PRIVATE_IMG = 1;
    
    private $dir;
    
    /** @var ImageService */
    private $imageService;
    
    /** @var LinkService */
    private $linkService;

    public function __construct($dir, ImageService $imageService, LinkService $linkService)
    {
        $this->dir = $dir;
        
        if (!is_dir($dir)) {
            umask(0);
            mkdir($dir, 0777);
        }
        
        $this->imageService = $imageService;
        $this->linkService = $linkService;
    }
    
    private function testFolder($type, $user)
    {
        umask(0);
        
        if ($type == ImageStorage::PUBLIC_IMG) {
            $dir = '/public';
            if (!is_dir($this->dir . $dir)) mkdir($$this->dir . dir, 0777);            
            
            $dir .= '/'. date('Y');
            if (!is_dir($this->dir . $dir)) mkdir($this->dir . $dir, 0777);
            
            $dir .= '/'. date("m");
            if (!is_dir($this->dir . $dir)) mkdir($this->dir . $dir, 0777);
            
            $dir .= '/'. date("d"); 
            if (!is_dir($this->dir . $dir)) mkdir($this->dir . $dir, 0777);
        } else if ($user) {
            $dir = '/private';
            if (!is_dir($this->dir . $dir)) mkdir($this->dir . $dir, 0777);
            
            $dir .= '/'. $user;
            if (!is_dir($this->dir . $dir)) mkdir($this->dir . $dir, 0777);
            
            $dir .= '/'. date('Y');
            if (!is_dir($this->dir . $dir)) mkdir($this->dir . $dir, 0777);
            
            $dir .= '/'. date("m");
            if (!is_dir($this->dir . $dir)) mkdir($this->dir . $dir, 0777);
        }
        
        if (!is_dir($this->dir . $dir .'/thumbs'))
            mkdir ($this->dir . $dir .'/thumbs', 0777);
        
        return $dir;
    }
    
    /**
     * Zpracuje přijatý obrázek
     * @param string $filename
     * @param mixed $data
     * @param int $type
     * @param User $user
     */
    public function Save($filename, $data, $type, User $user = NULL)
    {
        $image = Image::fromString($data);

        $dir = $this->testFolder($type, ($user) ? $user->id : NULL);
        $name = md5($filename . ($user ? $user->email:NULL) . time()) .'.jpg';;
        $newFileName = $this->dir . $dir .'/'. $name;
        
        $image->save($newFileName, 100, Image::JPEG);
        
        $image->resize(300, NULL);
        $thumbFileName = $this->dir . $dir . '/thumbs/'. $name;
        
        $image->save($thumbFileName, 50, Image::JPEG);
        
        $imageRecord = new Image2($name, $dir, $user);
        $this->imageService->save($imageRecord);
        
        return $this->linkService->create($imageRecord);
    }
}
