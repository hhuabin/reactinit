const SvgIcon: React.FC = () => {

    return (
        // {/* 所有svg默认viewBox="0 0 100 100" */}
        <div className="w-full min-h-screen text-[#333] text-[14px] leading-[24px]">
            {/* arrow */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-[8px] gap-y-[16px] p-[8px]">
                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <line x1="20" y1="35" x2="50" y2="65" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                            <line x1="50" y1="65" x2="80" y2="35" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">arrow-down</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <line x1="20" y1="65" x2="50" y2="35" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                            <line x1="50" y1="35" x2="80" y2="65" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">arrow-up</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <line x1="65" y1="20" x2="35" y2="50" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                            <line x1="35" y1="50" x2="65" y2="80" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">arrow-left</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <line x1="35" y1="20" x2="65" y2="50" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                            <line x1="65" y1="50" x2="35" y2="80" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">arrow-right</div>
                </div>
            </div>

            {/* base-icon */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-[8px] gap-y-[16px] p-[8px]">
                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            {/* <!-- 描述了一个勾形的路径，从 (20, 50) 开始，经过 (40, 70)，最终到达 (80, 30) --> */}
                            <path d="M20 50L40 70L80 30" stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">check</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            {/*
                                stroke-dasharray="85"设置路径的虚线长度，尽量和真实的path接近，dur才能准确
                                stroke-dasharray太短，会丢失部分路径
                                stroke-dasharray太长，dur比设置的小，如stroke-dasharray="170"此时dur="0.25s"
                            */}
                            <path d="M20 50L40 70L80 30" stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round"
                                strokeLinejoin="round" strokeDasharray="85" strokeDashoffset="85"
                            >
                                {/* <animate attributeName="stroke-dashoffset" from="80" to="0" dur="0.5s" fill="remove" /> */}
                                <animate attributeName="stroke-dashoffset" from="85" to="0" dur="0.5s" fill="freeze" />
                            </path>
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">animate-check</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <line x1="25" y1="25" x2="75" y2="75" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                            <line x1="75" y1="25" x2="25" y2="75" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">close</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <line x1="50" y1="20" x2="50" y2="80" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                            <line x1="20" y1="50" x2="80" y2="50" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">add</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            {/* <!-- 感叹号的竖线 --> */}
                            <line x1="50" y1="20" x2="50" y2="60" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                            {/* <!-- 感叹号的圆点 --> */}
                            <circle cx="50" cy="80" r="5" fill="#333" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">exclamation</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            {/* <!-- 圆圈，其他icon类似，有需要加上圆圈即可 --> */}
                            <circle cx="50" cy="50" r="45" stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round" />
                            {/* <!-- 感叹号的竖线 --> */}
                            <line x1="50" y1="25" x2="50" y2="58" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                            {/* <!-- 感叹号的圆点 --> */}
                            <circle cx="50" cy="75" r="5" fill="#333" />
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">circle-exclamation</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="45" cy="45" r="33" fill="none" stroke="#333" strokeWidth="8" strokeLinecap="round"></circle>
                            <line x1="70" y1="70" x2="85" y2="85" stroke="#333" strokeWidth="8" strokeLinecap="round"></line>
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">search</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            {/* <!-- 第一个圆点 --> */}
                            <circle cx="25" cy="50" r="6" fill="#333"></circle>
                            {/* <!-- 第二个圆点 --> */}
                            <circle cx="50" cy="50" r="6" fill="#333"></circle>
                            {/* <!-- 第三个圆点 --> */}
                            <circle cx="75" cy="50" r="6" fill="#333"></circle>
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">ellipsis</div>
                </div>
            </div>

            {/* loading */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-[8px] gap-y-[16px] p-[8px]">
                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            {/* <!-- 第一个圆点 --> */}
                            <circle cx="25" cy="50" r="4" fill="#333">
                                <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" begin="0s" />
                            </circle>
                            {/* <!-- 第二个圆点 --> */}
                            <circle cx="50" cy="50" r="4" fill="#333">
                                <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" begin="0.2s" />
                            </circle>
                            {/* <!-- 第三个圆点 --> */}
                            <circle cx="75" cy="50" r="4" fill="#333">
                                <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" begin="0.4s" />
                            </circle>
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">dot-loading</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            {/* <!-- 第一个圆点 --> */}
                            <circle cx="25" cy="50" r="6" fill="#999">
                                <animate attributeName="cx" values="25;50;25" dur="1s" repeatCount="indefinite" begin="0s" />
                                <animate attributeName="fill" values="#999;#333;#999" dur="1s" repeatCount="indefinite" begin="0s" />
                            </circle>
                            {/* <!-- 第二个圆点 --> */}
                            <circle cx="50" cy="50" r="6" fill="#999">
                                <animate attributeName="r" values="6;9;6" dur="1s" repeatCount="indefinite" begin="0s" />
                                <animate attributeName="fill" values="#999;#333;#999" dur="1s" repeatCount="indefinite" begin="0s" />
                            </circle>
                            {/* <!-- 第三个圆点 --> */}
                            <circle cx="75" cy="50" r="6" fill="#999">
                                <animate attributeName="cx" values="75;50;75" dur="1s" repeatCount="indefinite" begin="0s" />
                                <animate attributeName="fill" values="#999;#333;#999" dur="1s" repeatCount="indefinite" begin="0s" />
                            </circle>
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">loading</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            {/* <!-- 白色色背景圆圈 --> */}
                            <circle cx="50" cy="50" r="36" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" />
                            {/* <!-- 黑色动态圆圈，半径是36，弧度是 5/16(88.5) 圆 --> */}
                            <circle cx="50" cy="50" r="36" stroke="#333" strokeWidth="10" fill="none" strokeDasharray="88.5 194.5" strokeLinecap="round">
                                {/* <!-- 旋转动画 --> */}
                                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">loading-rotate</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="w-[50px] h-[50px] border border-[#eee] box-content">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                {/* <!-- 定义透明度渐变 --> */}
                                <linearGradient id="blackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    {/* <!-- 起始点：完全不透明 --> */}
                                    <stop offset="0%" stopColor="#333" stopOpacity="1" />
                                    {/* <!-- 结束点：完全透明 --> */}
                                    <stop offset="100%" stopColor="#333" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* <!-- 动态圆圈，半径是36，弧度是 1/2(141.5) 圆 --> */}
                            <circle cx="50" cy="50" r="36" stroke="url(#blackGradient)" strokeWidth="10" fill="none" strokeDasharray="141.5 141.5" strokeLinecap="round">
                                {/* <!-- 旋转动画 --> */}
                                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                        </svg>
                    </div>
                    <div className="w-full mt-[12px] text-center break-all">loading-gradient-rotate</div>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-[8px] gap-y-[16px] p-[8px]">

            </div>
        </div>
    )
}

export default SvgIcon
