import UserHeader from "../layout/UserHeader";

function UserLayout({ children }) {
    return (
        <>
            <UserHeader />
            <main>{children}</main>
        </>
    );
}

export default UserLayout;
