<?php
namespace Screenuj\Services;

use Screenuj\Entities\User;

/**
 * Description of UserService
 *
 * @author Jan Kadeřábek <kaderabek.jan@gmail.com>
 */
class UserService extends BaseService
{
    /**
     * @return string
     */
    protected function getEntityClassName()
    {
        return User::getClassName();
    }
}