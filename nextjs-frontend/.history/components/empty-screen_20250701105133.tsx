import { UseChatHelpers } from 'ai/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Explain ToC',
    message: `What is ToC?`
  },
  {
    heading: 'Summarize Privacy Policies',
    message: 'Summarize Privacy Policies\n'
  },
  {
    heading: 'Can I eat cookies',
    message: 'What are browser cookies?\n'
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Safe Secure Searching
        </h1>
        <div className="mb-4">
          <Image
            src="/search-safe-image.png"
            alt="Safe Secure Searching"
            width={400}
            height={200}
            className="rounded-md object-cover"
            priority
          />
        </div>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
