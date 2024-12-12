import { useNavigate } from 'react-router-dom'
import { Button } from 'antd-mobile'

const NotFound: React.FC = () => {

    const navigate = useNavigate()

    const toHome = () => {
        navigate("/")
    }

    return (
        <div className="
            flex justify-center items-center
            w-full h-full p-[12px] box-border
            text-[#333] text-[24px]
        ">
            <div className="
                absolute flex flex-col justify-center items-center
                p-[12px] box-border translate-y-[-100%]"
            >
                <div className="">你要找的页面不见啦！</div>
                <div className="mt-[10px] text-[#999] text-[12px]">
                    The page you are looking for is missing
                </div>

                <div className="mt-[30px]">
                    <Button fill='outline' onClick={toHome}>
                        返回首页
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
