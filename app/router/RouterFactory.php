<?php

namespace App;

use Nette,
	Nette\Application\Routers\RouteList,
	Nette\Application\Routers\Route,
	Nette\Application\Routers\SimpleRouter;


/**
 * Router factory.
 */
class RouterFactory
{

	/**
	 * @return \Nette\Application\IRouter
	 */
	public static function createRouter()
	{
		$router = new RouteList();
                               
                $router[] = new Route('sign', 'Sign:');
                $router[] = new Route('uploaded', 'Uploaded:');
                //$router[] = new Route('Homepage/Detail/<code>', 'Homepage:Detail', Route::ONE_WAY);
                $router[] = new Route('<code>', 'Homepage:detail');
               
                
                $router[] = new Route('<presenter>/<action>[/<id>]', array(
                    'presenter' => 'Homepage',
                    'action'    => 'default'
                ));
                

		return $router;
             
	}

}
