import { useEffect, useState } from "react";
import PageProps from "../../types/PageProps";

const Pagination = ({ paginator, update }: PageProps) => {

    const [pages, setPages] = useState<Array<number>>([]);

    useEffect(() => {
        // Vérification sécurisée
        if (paginator && paginator.pageable) {
            let output: Array<number> = [];
            for (let index = paginator.pageable.pageNumber; index < Math.min(paginator.pageable.pageNumber + 5, paginator.totalPages); index++) {
                output.push(index);
            }
            setPages(output);
        }
    }, [paginator]);

    const pageSelected = (num: number) => {
        if (num >= 0 && paginator && num < paginator.totalPages) {
            update(num);
        }
    }

    // Pas de rendu si paginator n'existe pas
    if (!paginator || !paginator.pageable) {
        return null;
    }

    return (
        <nav className="mt-3" aria-label="paginator">
            <ul className="pagination">
                <li className={"page-item " + (paginator.first ? "disabled" : "")}>
                    <button type="button" onClick={() => pageSelected(paginator.pageable.pageNumber - 1)} className="page-link">Précédent</button>
                </li>
                {pages.map(item => (
                    <li key={item} className="page-item">
                        <button type="button" onClick={() => pageSelected(item)} className={"page-link " + (item === paginator.pageable.pageNumber ? "active" : "")}>
                            {item + 1}
                        </button>
                    </li>
                ))}
                <li className={"page-item " + (paginator.last ? "disabled" : "")}>
                    <button type="button" className="page-link" onClick={() => pageSelected(paginator.pageable.pageNumber + 1)}>Suivant</button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
