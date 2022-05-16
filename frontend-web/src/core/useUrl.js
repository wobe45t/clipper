export const useUrl = () => {
    const url =  `${window.location.protocol}//${window.location.hostname}:5000/api`
    console.log(url)

    return url
}
