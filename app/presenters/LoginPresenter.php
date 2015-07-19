<?php

namespace App\Presenters;

use Screenuj\Services\UserService;
use Screenuj\Entities;

/**
 * Presenter for log in from Facebook, Google, ...
 */
class LoginPresenter extends BasePresenter
{
    /** @inject @var UserService */
    public $userService;
    
    public function __construct(UserService $userService)
    {
        parent::__construct();
        $this->userService = $userService;
    }
    
    public function handleFacebook($fbId, $name, $email, $token)
    {
        //@todo: přidání do databáze a vytvoření identity
        $user = $this->userService->findOneBy(['facebook' => $fbId]);
        
        if (!$user) //Neexistuje uživatel se zadaným FB ID
        {
            $user = $this->userService->findOneBy(['email' => $email]);
            
            if (!$user) //Neexistuje uživatel se stejným emailem
            {
                $user = new Entities\User("jmeno", $email, $fbId);
                $this->userService->save($user);    
                
            } 
            else 
            {
                /** @todo Sloučit účty */
            }
        }
        
        $identity = new \Nette\Security\Identity(4, '', ['type' => 'Facebook', 'signed' => new \DateTime()]);
        $this->user->login($identity);
        $this->sendPayload();
    }
}
