import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'

export default function Navbar() {

    const router = useRouter()

    return (
        <div className={styles.navbar_container}>
            <div className={styles.navigation_items}>
                <Link href="/board">
                    <div className={styles.button + " " + (router.pathname == "/board" ? styles.active : null)}>
                        Checkliste
                    </div>
                </Link>
                <Link href="/question">
                    <div className={styles.button + " " + (router.pathname == "/question" ? styles.active : null)}>
                        Fragebögen
                    </div>
                </Link>
                <Link href="/help">
                    <div className={styles.button + " " + (router.pathname == "/help" ? styles.active : null)}>
                        Hilfe
                    </div>
                </Link>
                <div style={{flex: "1"}}></div>
                <Link href="/account">
                    <div className={styles.button + " " + (router.pathname == "/account" ? styles.active : null)}>
                        <span class="material-symbols-outlined">account_circle</span>
                        <div className={styles.dropdown}>
                            <ul>
                                <Link href="/account"><li>Konto</li></Link>
                                <Link href="/preferences"><li>Einstellungen</li></Link>
                                <Link href="/"><li>Abmelden</li></Link>
                            </ul>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}