<?php
namespace Screenuj\Services;

use Screenuj\Entities\Image;

/**
 * Description of ImageService
 *
 * @author Jan Kadeřábek <kaderabek.jan@gmail.com>
 */
class ImageService extends BaseService
{
    /**
     * @return string
     */
    protected function getEntityClassName()
    {
        return Image::getClassName();
    }
    
    public function getByUserID($user)
    {
        $query = $this->getEm()->createQueryBuilder()
                ->select(['i'])
                ->from(Image::getClassName(), 'i')
                ->leftJoin('i.link', 'l')
                ->leftJoin('i.user', 'u')
                ->andWhere('u.id = :user')
                ->orderBy('i.uploaded', 'DESC')
                ->setParameter('user', $user);
        
        
        $query = $query->getQuery();
        $result = $query->getResult(\Doctrine\ORM\Query::HYDRATE_OBJECT);
       
        return $result;
    }
}