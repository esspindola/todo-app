import styles from "../styles/Tasks.module.scss";
import Card from "./ui/Card";
import Searchbar from "./ui/Searchbar";

export default function Tasks() {
  return (
    <div className={styles.Tasks}>
      <Searchbar />
      <div className={styles.CardsGrid}>
        <Card
          title="Aprender React"
          description="Completar el tutorial oficial de React y hacer ejercicios."
          status="en curso"
          onDelete={() => {}}
          onComplete={() => {}}
        />
        <Card
          title="Leer un libro"
          description="Avanzar 30 páginas del libro de productividad."
          status="completado"
          onDelete={() => {}}
          onComplete={() => {}}
        />
        <Card
          title="Hacer ejercicio"
          description="Salir a caminar 40 minutos por el parque."
          status="en curso"
          onDelete={() => {}}
          onComplete={() => {}}
        />
        <Card
          title="Organizar escritorio"
          description="Limpiar y ordenar el espacio de trabajo."
          status="completado"
          onDelete={() => {}}
          onComplete={() => {}}
        />
        <Card
          title="Planificar la semana"
          description="Escribir las tareas y objetivos para los próximos días."
          status="en curso"
          onDelete={() => {}}
          onComplete={() => {}}
        />
        <Card
          title="Meditar"
          description="Dedicar 10 minutos a la meditación guiada."
          status="en curso"
          onDelete={() => {}}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
}
