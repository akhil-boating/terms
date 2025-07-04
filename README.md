# FriendlyFinePrint
[Try it Yourself!](https://terms-mocha.vercel.app/)
You can make your own account, or use the existing credentials
```
email: conga-somber-9g@icloud.com 
password: Hello123
```

FriendlyFinePrint is a Mozilla Extension and Web Application to help users better understand Terms and Conditions, Privacy Policies, Cookie Statements and other types of documents with a lot of legalese and complicated jargons. 

[Link to Youtube Demo](https://youtu.be/zlMk5BIRqVg)


## Inspiration
Terms and Conditions, Privacy Policies and other such documents are sometimes intentionally over-complicated with a lot of legalese and complicated jargons in order to obfuscate contentious clauses.


We were inspired by this active court case - https://www.bbc.com/news/articles/cr7r9djxj0do
In this case, an end-user was denied their right to rightfully pursue legal actions against the Disney Corp because the end-user had signed away their rights to pursuing legal claims against Disney in court because the end-user had given up this right by signing up for a Disney+ Trial subscription. This could have been avoided if the Disney T&C was more easy to read or if there was some type of solution available to users for helping them analyze these documents before committing to them.

## Proposed Solution
- We've developed a MVP Firefox Extension and Web Application which retrieves the Terms and Conditions and Privacy Policy statements automatically each time the end-user visits a new website. 

![alt text](nextjs-frontend/public/demo/1.png)

- The application then redirects the user to our web application, where they receive a simpler breakdown of the text. 

- The user can also follow up with additional questions. Or, we've also developed a feature where the user can also upload their legal document and probe our model with their queries. 

![alt text](nextjs-frontend/public/demo/2.png)

## Tech Stack
```
Next.js
Firefox Extension
OpenAI Web Search and Completions API
```

## Future Considerations
We'd love to develop an open-source and closed-source version of this application. In a "Pro Version" of this application, we plan to also try to scrape or gather historical court records to reference against the analyzed T&C etc to identify potential infringement of local, state and federal laws.  