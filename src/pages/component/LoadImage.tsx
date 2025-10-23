import { useEffect, useState } from "react"
import httpClient, { fetchImgR, fetchImgV } from "../hooks/httpClient";
import { BeatLoader } from "react-spinners";


const LoadImage = ({ uri }: any) => {

    const [isImgRLoading, setIsImgRLoading] = useState(true);
    const [isImgVLoading, setIsImgVLoading] = useState(true);
    const [imgR, setImgR] = useState<any>(null);
    const [imgV, setImgV] = useState<any>(null);

    useEffect(() => {
        setIsImgRLoading(!false);
        httpClient.get(fetchImgR(uri))
            .then(res => {
                setIsImgRLoading(false);
                setImgR(res.data);
            })
            .catch(err => {
                setIsImgRLoading(false);
                setImgR("/images/notfound.png");
            })
    }, [])

    useEffect(() => {
        setIsImgRLoading(!false);
        httpClient.get(fetchImgV(uri))
            .then(res => {
                setIsImgVLoading(false);
                setImgV(res.data);
            })
            .catch(err => {
                setIsImgVLoading(false);
                setImgV("/images/notfound.png");
            })
    }, [])


    return (
        <div className="row">
            <div className="col-md-6 text-center">
                {isImgRLoading == true &&
                    <BeatLoader />
                }
                {isImgRLoading == false && <img src={imgR} className="img-fluid" />}
            </div>
            <div className="col-md-6 text-center">
                {isImgVLoading == true &&
                    <BeatLoader />
                }
                {isImgVLoading == false && <img src={imgV} className="img-fluid" />}
            </div>
        </div>
    )
}
export default LoadImage;