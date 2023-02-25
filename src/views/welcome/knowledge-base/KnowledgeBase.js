// ** React Imports
import { Link } from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardImg } from 'reactstrap'

// ** Styles
import '@styles/base/pages/page-knowledge-base.scss'
import i18n from '../../../configs/i18n'

const KnowledgeBase = () => {
  const knowledgeBase = [
    {
      id: 1,
      category: 'sales-automation',
      img: require('@src/assets/images/illustration/sales.svg').default,
      title: i18n.t('Aidez vos clients'),
      desc: i18n.t('Un bon vendeur peut toujours trouver la pièce nécessaire et la livrer à ses clients.')
    },
    {
      id: 2,
      category: 'marketing-automation',
      img: require('@src/assets/images/illustration/marketing.svg').default,
      title: i18n.t('Augmenter vos bénéfices'),
      desc: i18n.t('Créez une nouvelle source de ventes en répondant aux demandes des autres vendeurs.')
    },
    {
      id: 3,
      category: 'api-questions',
      img: require('@src/assets/images/illustration/personalization.svg').default,
      title: i18n.t('Faites passer votre business au niveau supérieur'),
      desc: i18n.t('Le marché des pièces détachées est énorme, nous vous aiderons à le couvrir.')
    }
  ]
  // ** States
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(knowledgeBase)
  }, [])

  const Content = ({ item }) => (
    <Col className='kb-search-content' key={item.id} md='4' sm='6'>
      <Card>
          <CardImg src={item.img} alt='knowledge-base-image' top />
          <CardBody className='text-center'>
            <h4>{item.title}</h4>
            <p className='text-body mt-1 mb-0'>{item.desc}</p>
          </CardBody>
      </Card>
    </Col>
  )

  const renderContent = () => {
    return data.map(item => {  
        return <Content key={item.id} item={item} />
    })
  }

  return (
    <Fragment>
      {/* <Breadcrumbs title='Knowledge Base' data={[{ title: 'Pages' }, { title: 'Knowledge Base' }]} /> */}
      {/* <KnowledgeBaseHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
      {data !== null ? (
        <div id='knowledge-base-content'>
          <Row className='kb-search-content-info match-height'>{renderContent()}</Row>
        </div>
      ) : null}
    </Fragment>
  )
}

export default KnowledgeBase
