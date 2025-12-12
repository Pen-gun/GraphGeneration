import Layout from "../layout/layout";
import { SearchBar } from "../components/search/search.component.tsx";

const homePage = () => {
    return (
        <Layout>
            <SearchBar onSearch={(query) => console.log("Searching for:", query)} />
        </Layout>
    );
}
export default homePage;