import { Button, Space } from 'antd-mobile'

import home from './home.module.less'

const Home: React.FC = () => {

    return (
        <>
            <div className={home.home}>
                <Space wrap>
                    <Button color='primary' fill='solid'>
                        Solid
                    </Button>
                    <Button color='primary' fill='outline'>
                        Outline
                    </Button>
                    <Button color='primary' fill='none'>
                        None
                    </Button>
                    <Button color='primary' fill='outline'>
                        Request
                    </Button>
                    <Button color='primary' fill='outline'>
                        fetchRequest
                    </Button>
                </Space>
            </div>
        </>
    )
}

export default Home
