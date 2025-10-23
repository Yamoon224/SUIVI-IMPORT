import BodyProps from "../../types/BodyProps"


const Wrapper = ({title, children}: BodyProps) => {
    return (
        <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
                <div className="heading1 margin_0">
                    <h2>{title}</h2>
                </div>
            </div>
            <div className="map_section padding_infor_info">
                {children}
            </div>
        </div>
    )
}

export default Wrapper;