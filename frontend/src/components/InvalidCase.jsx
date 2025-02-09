import classes from "./InvalidCase.module.css";

function InvalidCase({ text, valid }) {
  return (
    <div>
      <p className={valid ? classes.success : classes.warning}>{text}</p>
    </div>
  );
}

export default InvalidCase;
