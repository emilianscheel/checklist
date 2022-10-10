import { useRouter } from "next/router";
import styles from '../styles/Start.module.scss'

export default function Page() {

    const router = useRouter()

    function onOpen(event) {
        event.preventDefault();

        router.push('/' + event.target.elements.words.value)
    }

    return (
        <main>
            <form onSubmit={onOpen} className={styles.form}>
                <h1>Zum Erwachsen werden ...</h1>
                <h3>Checkliste eröffnen oder erstellen</h3>
                <p>Um eine Checkliste zu erstellen, gebe hier ein Passwort ein und bestätige mit „Öffnen“ Wenn du bereits ein Checkliste erstellt hast, gebe dein Passwort ein.</p>
                <input name="words" placeholder="Passwort"/>
                <button type="submit">Öffnen</button>
            </form>
        </main>
    )
}