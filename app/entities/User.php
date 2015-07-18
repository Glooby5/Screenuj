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
     * @var string
     * @ORM\Column(type="string", length=60)
     */
    public  $password;
    
    /**
     * @var datetime
     * @ORM\Column(type="datetime") 
     */
    public $registred;
}
