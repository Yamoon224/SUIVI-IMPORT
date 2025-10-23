import React from 'react'

interface CARD {
    fa: string,
    color?: string,
    number: number,
    title: string,
    colorStyle: String
}
const Card = ({ fa, color = '', colorStyle = '', number, title }: CARD) => {
    return (
        <div className="col-md-6 col-lg-3">
            <div className="full counter_section margin_bottom_30">
                <div className="couter_icon">
                    <div>
                        <i className={`fa ${fa} ${color}`} style={{ color:  colorStyle.toString()  }} />
                    </div>
                </div>
                <div className="counter_no">
                    <div>
                        <p className="total_no">{number}</p>
                        <p className="head_couter">{title}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card
