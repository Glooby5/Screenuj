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
    
    public function getByCode($code)
    {
        $query = $this->getEm()->createQueryBuilder()
                ->select(['i'])
                ->from(Image::getClassName(), 'i')
                ->leftJoin('i.link', 'l')
                ->andWhere('l.code = :code')
                ->setParameter('code', $code);
        
        
        $query = $query->getQuery();
        $result = $query->getResult();
       
        return $result;
    }
}