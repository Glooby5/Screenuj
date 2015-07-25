<?php
namespace Screenuj\Entities;

use Doctrine\ORM\Mapping  as ORM;
use Screenuj\Entities\Image;
use Screenuj\Entities\User;

/**
 * @author Jan Kadeřábek <kaderabek.jan@gmail.com>
 * @ORM\Entity
 */
class Link extends \Kdyby\Doctrine\Entities\BaseEntity
{
    use \Kdyby\Doctrine\Entities\Attributes\Identifier;
    
    /**
     * @var string
     * @ORM\Column(type="string", length=10)
     */
    public $code;
            
    /**
     * @var datetime
     * @ORM\Column(type="datetime") 
     */
    public $created;
    
    /**
     * @var datetime
     * @ORM\Column(type="datetime") 
     */
    public $expired;
    
    /**
     * @var Image
     * @ORM\OneToOne(targetEntity="Image")
     */
    public $image;
    
    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User", nullable=true)
     */
    public $user;
    
    /**
     * @param string $code
     * @param DateTime $expired
     * @param Image $image
     * @param User $user
     */
    public function __construct($code, $expired, Image $image, User $user = NULL)
    {
        $this->code = $code;
        $this->expired = $expired;
        $this->image = $image;
        $this->user = $user;
        $this->created = new \DateTime();
    }
}
