<?php
namespace Screenuj\Entities;

use Doctrine\ORM\Mapping  as ORM;
use Screenuj\Entities\User;

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
     * 
     * @param string $name
     * @param string $folder
     * @param Screenuj/Entities/User $user
     */
    public function __construct($name, $folder, $user)
    {
        $this->name = $name;
        $this->folder = $folder;
        $this->user = $user;
        $this->uploaded = new \DateTime();
    }
}
