// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, ListGroup} from 'reactstrap'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { X, FilePlus } from 'react-feather'
import SingleFileItem from './SingleFileItem'

let currentId = 0

function getNewId() {
  // we could use a fancier solution instead of a sequential ID :)
  return ++currentId
}

const FileUploader = (props) => {
  //props
  const {uploadedFiles, fileExtension, multipleFiles, onAddUrl, onDeleteUrl} = {...props}
  // ** State
  const [files, setFiles] = useState([])

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      toast.error('You can only upload image Files!.')
    } else {
      const mappedAcc = acceptedFiles.map((file) => ({ file, errors: [], id: getNewId() }))
      console.log(mappedAcc)
      setFiles([...files, ...mappedAcc])
    }
  }
  
  useEffect(() => {
    const loadData = async () => {
      if (uploadedFiles) {
        fetch(uploadedFiles).then(res => {
          res.arrayBuffer().then(buf => {
            console.log(buf)
            const file = new File([buf], 'image_data_url.jpg', { type: 'image/jpeg' })
            console.log('file', file)
            setFiles([{file, errors: [], id: getNewId()}])
          })
        })
        // const response = await fetch(uploadedFiles[0])
        // const blobObj = await response.blob()
        // console.log('blob', blobObj)
        // const file = new File([blobObj], 'image', {type: blobObj.type})
        // console.log('file', file)
        // setFiles([{file, errors: [], id: getNewId()}])
      }
    }
    loadData()
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: multipleFiles,
    accept: fileExtension,
    onDrop
  })

  const handleUploadFile = fileUrl => {
    onAddUrl(fileUrl)
  }
  const handleRemoveFile = (file, fileUrl) => {
    onDeleteUrl(fileUrl)
    //
    setFiles((curr) => curr.filter((fileWrapper) => fileWrapper.file !== file))
  }

  return (
    <Card>
      <CardBody>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <FilePlus size={64} />
            <h5>Drop Files here or click to upload</h5>
          </div>
        </div>
        {files.length ? (
          <Fragment>
            <ListGroup className='my-2'>
              {files.map((fileWrapper) => {
                console.log(fileWrapper)
                return <SingleFileItem
                          key={fileWrapper.id}
                          file={fileWrapper.file}
                          onDelete={handleRemoveFile}
                          onUpload={handleUploadFile}
                        />
              })}
            </ListGroup>
          </Fragment>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default FileUploader
