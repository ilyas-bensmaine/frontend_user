import React, { useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Button, ListGroupItem, Progress } from 'reactstrap'
// ** Third Party Imports
import { StopCircle, Trash2, X } from 'react-feather'
import axiosAPI from '../../../axios/apis/safiAutoBackend'

export default function SingleFileItem(props) {
    const {file, onDelete, onUpload} = {...props}
    //States
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [fileUrl, setFileUrl] = useState('')

    const onUploadProgressFunction = (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        setUploadProgress(percentage)
        if (percentage === 100) {
            setUploadComplete(true)
        }
    }
      //useEffect 
      const controller = new AbortController
      const onAbortUploading = () => {
        console.log('onAbortUploading')
        onDelete(file, fileUrl)
    }
      useEffect(async () => {
        const formData = new FormData()
        const config = { 
            onUploadProgress: onUploadProgressFunction
        }
        formData.append('file', file)
        try {
            const response = await axiosAPI.post('api/files/upload', formData, config, {signal: controller.signal})
            setFileUrl(response.data)
            onUpload(response.data)
        } catch (error) {
            console.log(error)
        }
        // useEffect cleanup function
        // return () => console.log('CLEAN UP')
    }, [])

    const renderFileSize = size => {
        if (Math.round(size / 100) / 10 > 1000) {
          return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
        } else {
          return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
        }
      }  
  return (
    <ListGroupItem className='d-flex align-items-center justify-content-between'>
    <div className='file-details d-flex align-items-center'>
      <div className='file-preview me-1'>
        <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
      </div>
      <div>
        <p className='file-name mb-0'>{file.name}</p>
        <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        <Progress value={uploadProgress}>{uploadProgress}%</Progress>
      </div>
    </div>
    {uploadComplete ? (
        <Button color='danger' size='sm' className='btn-icon' onClick={() => onDelete(file, fileUrl)}> 
            <Trash2 size={14} />
        </Button>
    ) : (
        <Button color='warning' size='sm' className='btn-icon' onClick={() => onAbortUploading()}> 
            <StopCircle size={14}/> 
        </Button>
    )}
  </ListGroupItem>
  )
}
