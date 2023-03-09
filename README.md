# Pull Request File Labeler

This action scans all changed files of a pull request and labels the PR based on the file endings. e.g. if a JavaScript file got changed it will add the label "javascript".

## Inputs

### `owner`

**Required** The owner of the repository. e.g. ``` ${{ github.repository_owner }} ``` .

### `repo`

**Required** The name of the repository. e.g. ``` ${{ github.event.repository.name }} ``` .

### `pr_number`

**Required** The ID of the Pull Request. e.g. ``` ${{ github.event.number }} ``` .

### `token`

**Required** Access token with the permissions to label a pull request. e.g. ``` ${{ secrets.PAT_TOKEN }} ``` .

## Outputs

### `labels`

It will add the related labels to the pull request, which is depending on the changed files of the pull request. 

### `pr comment`
It add a comment to the pull request with a summary of changes made in the pull request. e.g. 
```
Pull Request #1 has been updated with: 
  - 1 changes 
  - 1 additions 
  - 0 deletions 
```

## Example usage

```yaml
  - name: Annotate PR
    uses: tau-github-actions-for-testing/tau-own-action-pull-request@main
    with:
      owner: ${{ github.repository_owner }}
      repo: ${{ github.event.repository.name }}
      pr_number: ${{ github.event.number }}
      token: ${{ secrets.PAT_TOKEN }}
```
