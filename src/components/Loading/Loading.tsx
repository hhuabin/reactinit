const Loading: React.FC = () => {

    return (
        <div className=" flex justify-center items-center w-full h-full">
            <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="30" cy="50" r="5" fill="#1890ff">
                    <animate
                        attributeName="r"
                        values="5;8;5"
                        dur="1s"
                        repeatCount="indefinite"
                        begin="0s" />
                </circle>
                <circle cx="50" cy="50" r="5" fill="#1890ff">
                    <animate
                        attributeName="r"
                        values="5;8;5"
                        dur="1s"
                        repeatCount="indefinite"
                        begin="0.2s" />
                </circle>
                <circle cx="70" cy="50" r="5" fill="#1890ff">
                    <animate
                        attributeName="r"
                        values="5;8;5"
                        dur="1s"
                        repeatCount="indefinite"
                        begin="0.4s" />
                </circle>
            </svg>
        </div>
    )
}

export default Loading
