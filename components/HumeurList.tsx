import { useHumeurs } from './util/hooks';

export const HumeurList = () => {
    const { humeurs } = useHumeurs();
    return humeurs ? (
        <>
            {
                humeurs.map(({ id, text, author }, i) => (
                <div key={i}><h4>{text}</h4><span>{author.displayName}</span></div>
                ))
            }
        </>
    ) : null;
};