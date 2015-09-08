<?php
namespace Screenuj\Services;

use Screenuj\Entities\Link;
use Screenuj\Model\HashManager;

/**
 * Description of ImageService
 *
 * @author Jan Kadeřábek <kaderabek.jan@gmail.com>
 */
class LinkService extends BaseService
{
    /** @var HashManager */
    private $hashManager;
    
    public function __construct(\Kdyby\Doctrine\EntityManager $em, HashManager $hashManager)
    {
        parent::__construct($em);
        $this->hashManager = $hashManager;
    }
    
    /**
     * @return string
     */
    protected function getEntityClassName()
    {
        return Link::getClassName();
    }
    
    /**
     * 
     * @param \Screenuj\Entities\Image $image
     * @param cons time validity $validity
     * @param \Screenuj\Entities\User $user
     * @return string Shortcut code
     */
    public function create(\Screenuj\Entities\Image $image, $validity = NULL, $user = NULL)
    {        
        $code = $this->hashManager->encode($image->id);        
        
        $expired = new \DateTime();
        $expired->add(new \DateInterval("P7D"));
        
        $link = new Link($code, $expired, $image, $user);
        $this->save($link);

        return $code;
    }
}
