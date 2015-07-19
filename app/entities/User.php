<?php
namespace Screenuj\Entities;

use Doctrine\ORM\Mapping  as ORM;

/**
 * @author Jan Kadeřábek <kaderabek.jan@gmail.com>
 * @ORM\Entity
 */
class User extends \Kdyby\Doctrine\Entities\BaseEntity
{
    use \Kdyby\Doctrine\Entities\Attributes\Identifier;
    
    /**
     * @var string
     * @ORM\Column(type="string")
     */
    public $name;
    
    /**
     * @var string
     * @ORM\Column(type="string", unique=true)
     */
    public $email;
        
    /**
     * @var datetime
     * @ORM\Column(type="datetime") 
     */
    public $registred;
    
    /**
     * @var int Facebook ID
     * @ORM\Column(type="integer", nullable=true)
     */
    public $facebook;
    
    /**
     * 
     * @param type $name Name
     * @param type $email Email
     * @param type $facebook Facebook ID
     */
    public function __construct($name, $email, $facebook = NULL)
    {
        $this->name = $name;
        $this->email = $email;
        $this->facebook = $facebook;
        $this->registred = new \DateTime();
    }
}
