import React from 'react'

const Progress = ({progressName, progressValue, progressRate, icon: Icon}) => {
    return (
        <div className="flex flex-col justify-evenly items-center">
            <h2 className="textShadow text-xs companyText text-[#ffffff] font-bold opacity-100 text-center leading-5">
                {progressName}
            </h2>
            <div
                className="radial-progress bg-[#8ac24900] text-[#f15c2688] font-bold text-xl border-0 flex flex-col items-center justify-center shadow-lg"
                style={{ "--value":  progressValue , "--thickness": "4px" }}
                role="progressbar"
            >
                {Icon && <Icon className="text-[#8ac249]" />}
                <p className="text-[#8ac249]">{progressRate}</p>
            </div>
        </div>
    )
}

export default Progress
