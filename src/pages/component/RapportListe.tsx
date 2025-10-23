import React, { useState } from 'react'
import Pagination from './Pagination'

const RapportListe = ({data}:any) => {
    const [page, setPage] = useState('0');
    const [datas, setDatas] = useState<any>({});


    return (
        <>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Remise</th>
                            <th>Remise</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { }
                    </tbody>
                </table>
            </div>
            <Pagination update={setPage} paginator={datas} />
        </>
    )
}

export default RapportListe;
