<?php
namespace Screenuj\Entities;

use Doctrine\ORM\Mapping  as ORM;
use Screenuj\Entities\User;
use Screenuj\Entities\Image;

/**
 * @author Jan Kadeřábek <kaderabek.jan@gmail.com>
 * @ORM\Entity
 */
class Image extends \Kdyby\Doctrine\Entities\BaseEntity
{
    use \Kdyby\Doctrine\Entities\Attributes\Identifier;
    
    /**
     * @var string
     * @ORM\Column(type="string", length=36)
     */
    public $name;
    
    /**
     * @var string
     * @ORM\Column(type="string")
     */
    public $folder;
        
    /**
     * @var datetime
     * @ORM\Column(type="datetime") 
     */
    public $uploaded;
    
    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     */
    public $user;
    
    /**
     * @var Link
     * @ORM\OneToMany(targetEntity="Link", mappedBy="image")
     */
    public $link;
    
    /**
     * @var string
     * @ORM\Column(type="string")
     */
    public $token;
    
    /**
     * @param string $name
     * @param string $folder
     * @param User $user
     */
    public function __construct($name, $folder, $user, $token)
    {
        $this->name = $name;
        $this->folder = $folder;
        $this->user = $user;
        $this->uploaded = new \DateTime();
        $this->token = $token;
    }
}
