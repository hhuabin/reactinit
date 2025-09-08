import { useEffect, useState } from 'react'

import { Upload as AntdUpload } from 'antd'
import type { UploadFile as AntdUploadFile } from 'antd'
import type { UploadProps } from 'antd'

import { Upload } from '@/components/Upload'
import type { UploadFile } from '@/components/Upload'


const Developing: React.FC = () => {

    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            status: 'done',
            message: '',
            percent: 0,
        },
    ])
    const [antdFileList, setAntdFileList] = useState<AntdUploadFile[]>([{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }])

    const changeFileList = (files: UploadFile[]) => {
        setFileList(files)
    }
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setAntdFileList(newFileList)

    const beforeRead = (files: File[]) => {
        return Promise.resolve(true)
    }

    const beforeDelete = () => {
        return Promise.resolve(true)
    }

    return (
        <div className='w-full'>
            <div className='w-full'>
                <Upload
                    fileList={fileList}
                    onChange={changeFileList}
                    beforeRead={beforeRead}
                    beforeDelete={beforeDelete}
                    multiple
                    action={{
                        url: 'https://sk.cyctapp.com/yct/suikang/oldcar/scrap/file/upload',
                        method: 'POST',
                    }}
                ></Upload>
            </div>
            <div className='w-full'>
                <AntdUpload
                    listType='picture-card'
                    fileList={antdFileList}
                    onChange={handleChange}
                    multiple
                >
                    {fileList.length < 5 && '+ Upload'}
                </AntdUpload>
            </div>
        </div>
    )
}

export default Developing
