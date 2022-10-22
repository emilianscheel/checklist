import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import styles from '../styles/Start.module.scss'

export default function Page() {

    const router = useRouter()
    const [cookie, setCookie] = useCookies(["user"])

    function onOpen(event) {
        event.preventDefault()

        const username = event.target.elements.username.value
        const password = event.target.elements.password.value

        fetch('/api/login', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ username, password })
        })
        .then((res) => res.json())
        .then((data) => {
            setCookie("accessToken", data.accessToken, {
                path: "/",
                maxAge: 3600, // Expires after 1hr
                sameSite: false,
            })

            router.push("/board")
        })

        
    }

    return (
        <main>
            <div className={styles.login_container}>
                
                <h1>Zum Erwachsen werden ...</h1>
                
                <form onSubmit={onOpen} className={styles.form}>
                    <h3>Checkliste eröffnen oder erstellen</h3>
                    <p>Um eine Checkliste zu erstellen, gib hier ein Passwort ein und bestätige mit „Öffnen“ Wenn du bereits eine Checkliste erstellt hast, gebe dein Passwort ein.</p>
                    <input name="username" type="username" placeholder="Nutzername"/>
                    <input name="password" type="password" placeholder="Passwort"/>
                    <button type="submit">Anmelden und öffnen</button>
                </form>
            </div>
        </main>
    )
}