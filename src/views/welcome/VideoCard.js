// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

// ** Third Party Components
import ReactPlayer from 'react-player'

const MediaPlayerVideo = () => {
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle tag='h4'>Video</CardTitle>
      </CardHeader> */}
      <CardBody>
        <ReactPlayer
          width='100%'
          controls={true}
          className='react-player-video'
          url='https://youtu.be/lg_m2vnejes'
        />
      </CardBody>
    </Card>
  )
}

export default MediaPlayerVideo
