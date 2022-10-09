const fs = require('fs');
import styles from './../styles/Page.module.scss'

export default function Page({ data }) {
    return (
        <main>
            <h1>Zum Erwachsen werden ...</h1>
            <div className={styles.container}>
                {data['bereiche'].map((bereich, index) => 
                    <div>
                        <h1>{bereich['titel']}</h1>
                        <ul>
                            {bereich['tätigkeiten'].map((tätigkeit, _index) => 
                                <li>
                                    <a>{tätigkeit}</a>
                                    <div>
                                        <input id={index + "-" + _index} type="checkbox"/><label for={index + "-" + _index}></label>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    )
}

export function getServerSideProps() {

    const data = fs.readFileSync('./data/data.json',
            {encoding:'utf8'});

    return {
        props: {
            data: JSON.parse(data)
        }
    }
}