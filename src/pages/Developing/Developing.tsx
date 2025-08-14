import { useEffect, useState } from 'react'

import { Upload as AntdUpload } from 'antd'
import type { UploadFile as AntdUploadFile } from 'antd'

import Upload from '@/components/Upload/Upload'
import type { UploadFile } from '@/components/Upload/Upload'


const Developing: React.FC = () => {

    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            status: 'done',
            message: '上传失败',
            percent: 0,
        },
    ])
    const [antdFileList, setAntdFileList] = useState<AntdUploadFile[]>([{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }])

    return (
        <div className='w-full'>
            <div className='w-full'>
                <Upload
                    fileList={fileList}
                ></Upload>
            </div>
            <div className='w-full'>
                <AntdUpload
                    listType='picture-card'
                    fileList={antdFileList}
                >
                    {fileList.length < 5 && '+ Upload'}
                </AntdUpload>
            </div>
        </div>
    )
}

export default Developing
