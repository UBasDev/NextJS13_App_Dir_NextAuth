import Protected from "@/providers/Protected";

export default function Layout({
  children, // Bu bir nested layouttur. Parent layoutun içerisinde renderlanır. Bu layoutun sibling veya child pageleri de bu layout içerisinde renderlanırlar
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <section>{children}</section>
    </Protected>
  );
}
