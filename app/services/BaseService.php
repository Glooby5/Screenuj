<?php
namespace Screenuj\Services;

/**
 * Description of BaseService
 *
 * @author Jan Kadeřábek <kaderabek.jan@gmail.com>
 */
class BaseService
{
    /** @var \Kdyby\Doctrine\EntityManager */
    protected $em;

    /** @var \Kdyby\Doctrine\EntityDao */	
    protected $repository;

    protected $entityClassName;

    public function __construct(\Kdyby\Doctrine\EntityManager $em)
    {
        $this->em = $em;
        $this->repository = $em->getRepository($this->getEntityClassName());        
    }    

    /**
     * Save entity
     * @param type $entity
     */
    public function save($entity)
    {
        $this->em->persist($entity);
        $this->em->flush();
    }

    /**
     * @return \Kdyby\Doctrine\EntityDao
     */
    public function getRepository()
    {
        return $this->repository;
    }

    /**
     * @return \Kdyby\Doctrine\EntityManager
     */
    public function getEm()
    {
        return $this->em;
    }

    public function persist($entity)
    {
        $this->getEm()->persist($entity);
    }

    public function flush()
    {
        $this->getEm()->flush();
    }
    
    public function fetchName()
    {
        return $this->repository->findPairs('name');
    }
    
    public function findAll()
    {
        return $this->getRepository()->findAll();
    }
    
    public function findBy(array $array)
    {
        return $this->getRepository()->findBy($array);
    }
    
    public function findOneBy(array $array)
    {
        return $this->getRepository()->findOneBy($array);
    }
    
    public function findPairs(array $array = NULL, $value = NULL)
    {
        return $this->getRepository()->findPairs($array, $value);
    }
    
    public function get($id)
    {
        return $this->repository->find($id);
    }
}