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
    private $folder;
    private static $sFolder;
    
    /** @var ImageService */
    private $imageService;
    
    /** @var LinkService */
    private $linkService;

    public function __construct($dir, $folder, ImageService $imageService, LinkService $linkService)
    {
        $this->dir = $dir;
        $this->folder = $folder;
        self::$sFolder = $folder;
        
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
            if (!is_dir($this->dir . $dir)) mkdir($this->dir . $dir, 0777);            
            
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
        
        $image->resize(300, 300, Image::EXACT);
        //$image->sharpen();
        $thumbFileName = $this->dir . $dir . '/thumbs/'. $name;        
        $image->save($thumbFileName, 50, Image::JPEG);
        
        $result['image'] = new Image2($name, $dir, $user, md5((new \DateTime())->format('Y-m-d H:i:s')));
        $this->imageService->save($result['image']);
        $result['code'] = $this->linkService->create($result['image']);
        
        return $result;
    }
    
    public function Update($token, $data)
    {
        $olgImage = $this->imageService->findOneBy(['token' => $token]);
        
        if (!$olgImage)
            throw new \Exception("Neplatný token.");
        
        $image = Image::fromFile($data);
        $image->save($this->dir . $olgImage->folder . '/' . $olgImage->name);              
        
        $image->resize(300, 300, Image::EXACT);
        $thumbFileName = $this->dir . $olgImage->folder . '/thumbs/' . $olgImage->name;  
        $image->save($thumbFileName, 50, Image::JPEG);
        
    }
    
    public function LoadImage(Image2 $image)
    {
        $url = $this->dir . $image->folder . '/' . $image->name;

        return $this->folder . $image->folder . '/' . $image->name;
    }
    
    public static function LoadThumbUrl(Image2 $image)
    {
        $path = self::$sFolder . $image->folder . '/thumbs/' . $image->name;
        
        return $path;
    }
}
