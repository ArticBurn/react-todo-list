import { Form,useLoaderData,useFetcher } from "react-router-dom";
import { getContact,updateContact } from "../module/contacts";

export const loader = async ({params}) => {
  const contact = await getContact(params.contactId);
  if(!contact){
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    })
  }
  return getContact(params.contactId)
}

export const action = async ({request, params}) => {
  let formData = await request.formData();
  return updateContact(params.contactId, {favorite: formData.get('favorite') === 'true'})
}

const Contact = () => {
  const contact = useLoaderData();
  // {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placekitten.com/g/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };
  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
          alt={contact.first}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last} / {contact.id}
            </>
          ) : (
            <i>{contact.id}</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Contact;

function Favorite({ contact }) {
  const fetcher = useFetcher()
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  if (fetcher.formData){
    favorite = fetcher.formData.get('favorite') === 'true'
    // console.log(fetcher);
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}